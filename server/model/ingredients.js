const conn = require("./db");

// ingredients 객체를 정의하고, 이 객체는 재료 이름을 기반으로 음식을 검색하는 기능
const ingredients = {
    searchFoodsByIngredient: (ingredientName, callback) => {
        const sql = `
            SELECT Foods.food_name
            FROM Ingredients
            JOIN Foods ON Ingredients.food_idx = Foods.food_idx
            WHERE Ingredients.ingre_name LIKE ?;
        `;
        const values = [`%${ingredientName}%`];
        conn.query(sql, values, callback);
    }
};

module.exports = ingredients;