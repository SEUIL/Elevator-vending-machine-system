export const PRODUCTS = [
    {
        id: 1,
        name: "Coca-Cola",
        price: 1500,
        category: "Drink",
        img: "/assets/coke.png", // 이미지가 없으면 텍스트로 대체됩니다
        stock: 7,
        volume: "350ml",
        calories: "147kcal",
        expirationDate: "2026.05.27",
        allergyInfo: "없음",
        locationNum: 101, // 자판기 내부 위치
    },
    {
        id: 2,
        name: "Sprite",
        price: 1400,
        category: "Drink",
        img: "/assets/sprite.png",
        stock: 0, // 품절 테스트용
        volume: "350ml",
        calories: "140kcal",
        expirationDate: "2026.06.01",
        allergyInfo: "없음",
        locationNum: 102,
    },
];