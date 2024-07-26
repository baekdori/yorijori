from flask import Flask, request, jsonify  # Flask 모듈을 가져와 웹 서버와 요청/응답 처리를 위한 객체와 함수를 가져옵니다.
import torch  # PyTorch의 주요 모듈을 가져옵니다.
from transformers import BertTokenizer, BertForSequenceClassification  # BERT 모델과 토크나이저를 가져옵니다.
import mysql.connector  # MySQL 데이터베이스와 연결하기 위한 모듈을 가져옵니다.
from mysql.connector import Error  # MySQL 관련 오류 처리를 위한 Error 클래스를 가져옵니다.
import torch.nn.functional as F  # PyTorch의 함수적 API를 가져옵니다.

app = Flask(__name__)  # Flask 애플리케이션 인스턴스를 생성합니다.

# 모델 및 토크나이저 로드
model_path = 'yorijori_model.pth'
model = BertForSequenceClassification.from_pretrained('monologg/kobert', num_labels=2)
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

tokenizer = BertTokenizer.from_pretrained('monologg/kobert')

def preprocess_comment(comment):
    # 댓글을 BERT 모델 입력 형식으로 변환 (토큰화 및 패딩)
    inputs = tokenizer.encode_plus(
        comment,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        return_tensors='pt',
        truncation=True
    )
    return inputs['input_ids'].to(device), inputs['attention_mask'].to(device)

def predict_sentiment(comment):
    input_ids, attention_mask = preprocess_comment(comment)  # 댓글 전처리

    with torch.no_grad():  # 그래디언트 계산을 비활성화하여 메모리 사용을 줄입니다.
        outputs = model(input_ids, attention_mask=attention_mask)  # 모델에 입력 데이터를 통과시킵니다.
        logits = outputs.logits
        probabilities = F.softmax(logits, dim=-1)
        predicted_label = torch.argmax(probabilities, dim=1).item()

    sentiment = 'positive' if predicted_label == 1 else 'negative'  # 예측된 값을 기반으로 감정 결정
    return sentiment

# MySQL 데이터베이스 연결 설정 함수
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='project-db-stu3.smhrd.com',  # MySQL 서버의 호스트 주소
            port=3307,                         # MySQL 서버의 포트 번호
            user='Insa5_JSB_hacksim_1',       # MySQL 사용자 이름
            password='aischool1',              # MySQL 비밀번호
            database='Insa5_JSB_hacksim_1'    # 사용할 데이터베이스 이름
        )
        if connection.is_connected():  # 데이터베이스 연결 확인
            return connection
    except Error as e:
        print(f"Error: {e}")  # 오류 발생 시 오류 메시지를 출력합니다.
        return None

# '/submit' 엔드포인트 정의
@app.route('/submit', methods=['POST'])
def submit():
    data = request.json  # 요청 본문에서 JSON 데이터를 파싱합니다.
    user_id = data.get('id')         # 사용자 ID를 추출합니다.
    comment = data.get('comment')    # 댓글 내용을 추출합니다.
    food = data.get('food')          # 음식 정보를 추출합니다.

    sentiment = predict_sentiment(comment)  # 댓글에 대한 감정을 예측합니다.

    connection = get_db_connection()  # 데이터베이스 연결을 시도합니다.
    if connection:
        cursor = connection.cursor()  # 데이터베이스 커서를 생성합니다.
        try:
            # 댓글 데이터를 데이터베이스에 삽입합니다.
            cursor.execute("INSERT INTO comments (user_id, comment, food, sentiment) VALUES (%s, %s, %s, %s)",
                           (user_id, comment, food, sentiment))
            connection.commit()  # 트랜잭션을 커밋합니다.
            response = {'status': 'success', 'message': 'Data inserted successfully', 'sentiment': sentiment}
        except Error as e:
            response = {'status': 'error', 'message': str(e)}  # 오류 발생 시 응답
        finally:
            cursor.close()  # 커서를 닫습니다.
            connection.close()  # 데이터베이스 연결을 닫습니다.
    else:
        response = {'status': 'error', 'message': 'Failed to connect to database'}  # 데이터베이스 연결 실패 응답

    return jsonify(response)  # JSON 형식으로 응답을 반환합니다.

# '/comments' 엔드포인트 정의
@app.route('/comments', methods=['GET'])
def get_comments():
    connection = get_db_connection()  # 데이터베이스 연결을 시도합니다.
    if connection:
        cursor = connection.cursor(dictionary=True)  # 데이터베이스 커서를 생성합니다 (사전 형태로 결과 반환).
        try:
            cursor.execute("SELECT * FROM comments")  # 모든 댓글 데이터를 조회합니다.
            rows = cursor.fetchall()  # 모든 결과를 가져옵니다.
            response = {'status': 'success', 'data': rows}  # 성공 응답
        except Error as e:
            response = {'status': 'error', 'message': str(e)}  # 오류 발생 시 응답
        finally:
            cursor.close()  # 커서를 닫습니다.
            connection.close()  # 데이터베이스 연결을 닫습니다.
    else:
        response = {'status': 'error', 'message': 'Failed to connect to database'}  # 데이터베이스 연결 실패 응답

    return jsonify(response)  # JSON 형식으로 응답을 반환합니다.

if __name__ == '__main__':
    app.run(debug=True)  # Flask 애플리케이션을 디버그 모드에서 실행합니다.