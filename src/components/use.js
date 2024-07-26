// 게시글 보기 api
try {
    const foodIdx = 3;
    const response = await fetch(`http://localhost:4000/foods/postsee/${foodIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('정보를 불러올 수 없습니다.');
    }
    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error('에러 발생', error);
    alert('정보를 불러올 수 없습니다.');
}
// 게시글 수정 api
try {
    const food_idx = 3;
    const udptmodify = {
        food_name: '피자나라 치킨공주',
        food_desc: '맜잇다',
        food_video: 'null',
        food_recipe: '안알랴쥼',
        food_mood: '감자, 고추, 파인애플',
        ingre_img: 'null',
        user_id: 'kws' // 실제 user_id 값을 여기에 설정
    };

    const response = await fetch(`http://localhost:4000/foods/postmodify/${food_idx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(udptmodify)
    });

    if (!response.ok) {
        throw new Error('정보를 수정할 수 없습니다.');
    }

    const data = await response.json();
    console.log('게시글 수정 응답:', data);
} catch (error) {
    console.error('에러 발생:', error);
    alert('정보를 수정할 수 없습니다.');
}
// 게시글 삭제 api