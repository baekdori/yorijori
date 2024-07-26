from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import mysql.connector
from mysql.connector import Error
import torch.nn.functional as F

# Flask 애플리케이션 생성
app = Flask(__name__)

# 모델 및 토크나이저 로드
model_path = 'yorijori_model.pth'  # 모델 가중치 파일 경로
model = BertForSequenceClassification.from_pretrained('monologg/kobert', num_labels=2)  # 사전 훈련된 BERT 모델 로드
model.load_state_dict(torch.load(model_path))  # 모델 가중치를 로드 (CPU에서 로드)
model.eval()  # 모델을 평가 모드로 설정

tokenizer = BertTokenizer.from_pretrained('monologg/kobert')  # 사전 훈련된 BERT 토크나이저 로드

def preprocess_comment(comment):
# 댓글을 BERT 모델의 입력 형식으로 변환하는 함수.

    inputs = tokenizer.encode_plus(
        comment,                     # 분석할 댓글
        add_special_tokens=True,     # [CLS]와 [SEP] 토큰 추가
        max_length=128,              # 최대 길이 128로 설정
        padding='max_length',        # 패딩을 최대 길이로 설정
        return_tensors='pt',         # 파이토치 텐서로 반환
        truncation=True              # 입력 길이가 max_length를 초과할 경우 잘라냄
    )
    return inputs['input_ids'], inputs['attention_mask']  # 입력 ID와 어텐션 마스크 반환

def predict_sentiment(comment):
# 댓글의 감정 예측

    input_ids, attention_mask = preprocess_comment(comment)  # 댓글을 전처리

    with torch.no_grad():  # 그래디언트 계산 비활성화
        outputs = model(input_ids, attention_mask=attention_mask)  # 모델에 입력 데이터 통과
        logits = outputs.logits  # 모델의 출력 (로짓)
        probabilities = F.softmax(logits, dim=-1)  # 소프트맥스 함수로 확률 계산
        predicted_label = torch.argmax(probabilities, dim=1).item()  # 예측된 라벨 (클래스) 추출

    sentiment = 'positive' if predicted_label == 1 else 'negative'  # 예측된 라벨에 따라 감정 결정
    return sentiment

def get_db_connection():
# MySQL 데이터베이스에 연결하는 함수.

    try:
        # 데이터베이스 연결 설정
        connection = mysql.connector.connect(
            host='project-db-stu3.smhrd.com',  # MySQL 서버 호스트
            port=3307,                         # MySQL 서버 포트
            user='Insa5_JSB_hacksim_1',       # MySQL 사용자 이름
            password='aischool1',              # MySQL 비밀번호
            database='Insa5_JSB_hacksim_1'    # 데이터베이스 이름
        )
        if connection.is_connected():  # 연결 확인
            return connection
    except Error as e:
        print(f"Error: {e}")  # 오류 발생 시 오류 메시지 출력
        return None

@app.route('/submit', methods=['POST'])
def submit():
# 댓글을 제출하고 감정을 예측하여 데이터베이스에 저장하는 엔드포인트.

    data = request.json  # 요청 본문에서 JSON 데이터 파싱
    user_id = data.get('id')         # 사용자 ID 추출
    comment = data.get('comment')    # 댓글 내용 추출
    food = data.get('food')          # 음식 정보 추출

    sentiment = predict_sentiment(comment)  # 댓글에 대한 감정 예측

    connection = get_db_connection()  # 데이터베이스 연결 시도
    if connection:
        cursor = connection.cursor()  # 데이터베이스 커서 생성
        try:
            # 댓글 데이터를 데이터베이스에 삽입
            cursor.execute("INSERT INTO comments (user_id, comment, food, sentiment) VALUES (%s, %s, %s, %s)",
                           (user_id, comment, food, sentiment))
            connection.commit()  # 트랜잭션 커밋
            response = {'status': 'success', 'message': 'Data inserted successfully', 'sentiment': sentiment}
        except Error as e:
            response = {'status': 'error', 'message': str(e)}  # 오류 발생 시 응답
        finally:
            cursor.close()  # 커서 닫기
            connection.close()  # 데이터베이스 연결 닫기
    else:
        response = {'status': 'error', 'message': 'Failed to connect to database'}  # 데이터베이스 연결 실패 응답

    return jsonify(response), 200 if response['status'] == 'success' else 400  # 응답 반환

@app.route('/comments', methods=['GET'])
def get_comments():
#데이터베이스에서 모든 댓글을 조회하는 엔드포인트.
    
    connection = get_db_connection()  # 데이터베이스 연결 시도
    if connection:
        cursor = connection.cursor(dictionary=True)  # 데이터베이스 커서 생성 (사전 형태로 결과 반환)
        try:
            cursor.execute("SELECT * FROM comments")  # 모든 댓글 데이터 조회
            rows = cursor.fetchall()  # 모든 결과 가져오기
            response = {'status': 'success', 'data': rows}  # 성공 응답
        except Error as e:
            response = {'status': 'error', 'message': str(e)}  # 오류 발생 시 응답
        finally:
            cursor.close()  # 커서 닫기
            connection.close()  # 데이터베이스 연결 닫기
    else:
        response = {'status': 'error', 'message': 'Failed to connect to database'}  # 데이터베이스 연결 실패 응답

    return jsonify(response), 200 if response['status'] == 'success' else 400  # 응답 반환

if __name__ == '__main__':
    app.run(debug=False)  # 디버그 모드에서 애플리케이션 실행
