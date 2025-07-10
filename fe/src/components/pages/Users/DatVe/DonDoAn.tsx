// components/FoodSelectionDisplay.tsx
import React, { useState, useEffect } from "react";
import { Button, Spin, InputNumber } from "antd";
import { useListFoods } from "../../../hook/duHook"; // Đảm bảo đường dẫn đúng
import { Food } from "../../../types/Uses"; // Đảm bảo đường dẫn đúng

// Định nghĩa kiểu cho món ăn đã chọn, bao gồm số lượng
export interface SelectedFoodItem extends Food {
  quantity: number;
}

// Hàm getImageUrl (sao chép từ FoodList.tsx hoặc bạn có thể tạo một file util chung)
const BASE_URL = "http://127.0.0.1:8000"; // Đảm bảo BASE_URL của bạn được định nghĩa
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/100";
  return `${BASE_URL}/storage/${path}`;
};


// Định nghĩa Props của component (chúng ta sẽ theo Lựa chọn 1: tự fetch data)
interface Props {
  onFoodQuantityChange: (foodItem: SelectedFoodItem) => void;
  // selectedFoods: SelectedFoodItem[]; // Nếu bạn chọn Lựa chọn 2 thì bỏ comment dòng này
}

const FoodSelectionDisplay: React.FC<Props> = ({ onFoodQuantityChange }) => {
  const { data, isLoading } = useListFoods();
  const foodList = data?.data || []; // Assuming data.data holds the array of foods

  const [foodQuantities, setFoodQuantities] = useState<Map<number, number>>(new Map());

  // Effect để khởi tạo số lượng
  useEffect(() => {
    if (foodList.length > 0) {
      const initialQuantities = new Map<number, number>();
      foodList.forEach((food: Food) => {
        initialQuantities.set(food.id, 0); // Khởi tạo tất cả số lượng về 0
      });
      setFoodQuantities(initialQuantities);
    }
  }, [foodList]);

  // Hàm để lấy số lượng của một món ăn cụ thể
  const getQuantity = (foodId: number): number => foodQuantities.get(foodId) || 0;

  // Hàm xử lý thay đổi số lượng khi nhấn nút +/-
  const handleQuantityChange = (food: Food, change: number) => {
    setFoodQuantities(prevQuantities => {
      const newQuantities = new Map(prevQuantities);
      const currentQuantity = newQuantities.get(food.id) || 0;
      const updatedQuantity = Math.max(0, currentQuantity + change); // Đảm bảo số lượng không âm
      newQuantities.set(food.id, updatedQuantity);

      // Gọi callback để thông báo cho component cha về sự thay đổi
      onFoodQuantityChange({ ...food, quantity: updatedQuantity });

      return newQuantities;
    });
  };

  return (
    <div style={{ flex: 1, padding: 20, border: "1px solid #ddd", borderRadius: 8, marginLeft: 20, backgroundColor: "#282c3f" }}>
      <h3 style={{ color: "white" }}>Chọn đồ ăn kèm</h3>
      {isLoading ? (
        <Spin />
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {foodList.map((food: Food) => {
            const quantity = getQuantity(food.id);
            return (
              <div
                key={food.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 12,
                  width: "100%", // Chia 2 cột, trừ gap
                  boxSizing: "border-box", // Đảm bảo padding không làm tràn width
                  textAlign: "left", // Thay đổi căn giữa thành căn trái
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  display: "flex", // Sử dụng flexbox cho bố cục ảnh và chữ
                  alignItems: "center", // Căn giữa theo chiều dọc
                }}
              >
                {/* SỬ DỤNG getImageUrl VÀ food.image */}
                <img
                  src={getImageUrl(food.image)} // <<< SỬA TẠI ĐÂY
                  alt={food.ten_do_an}
                  style={{
                    width: 80, // Kích thước ảnh nhỏ hơn
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                    marginRight: 12, // Khoảng cách giữa ảnh và chữ
                  }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 15, color:"black",paddingBottom:"10px" }}>{food.ten_do_an}</div>
                  <div style={{ color: "#555", fontSize: 14 }}>
                    {food.gia_ban.toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginLeft: 'auto' }}>
                  <Button
                    onClick={() => handleQuantityChange(food, -1)}
                    size="small"
                    disabled={quantity === 0}
                    style={{ backgroundColor: "#e50914", borderColor: "#e50914", color: "white" }}
                  >
                    -
                  </Button>
                  <InputNumber
                    min={0}
                    value={quantity}
                    onChange={(value) => {
                      const newQuantity = value !== null ? value : 0;
                      setFoodQuantities(prev => {
                          const updated = new Map(prev);
                          updated.set(food.id, newQuantity);
                          return updated;
                      });
                      onFoodQuantityChange({ ...food, quantity: newQuantity });
                    }}
                    style={{ margin: "0 8px", width: 40, textAlign: "center" }}
                    readOnly
                  />
                  <Button
                    onClick={() => handleQuantityChange(food, 1)}
                    size="small"
                    style={{ backgroundColor: "#e50914", borderColor: "#e50914", color: "white" }}
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodSelectionDisplay;