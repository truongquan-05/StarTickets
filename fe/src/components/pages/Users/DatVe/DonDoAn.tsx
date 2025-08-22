import React, { useState, useEffect, useMemo } from "react";
import { Button, Spin } from "antd";
import { useListFoodsClient } from "../../../hook/duHook";
import { Food } from "../../../types/Uses";
import { useListPhongChieuClien } from "../../../hook/hungHook";

export interface SelectedFoodItem extends Food {
  quantity: number;
}

const BASE_URL = "http://127.0.0.1:8000";
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/100";
  return `${BASE_URL}/storage/${path}`;
};

interface Props {
  onFoodQuantityChange: (foodItem: SelectedFoodItem) => void;
  phongId: number;
}

const FoodSelectionDisplay: React.FC<Props> = ({
  onFoodQuantityChange,
  phongId,
}) => {
  const { data: foodData, isLoading: isLoadingFoods } = useListFoodsClient();
  const { data: phongData } = useListPhongChieuClien({
    resource: "client/phong_chieu",
  });

  const foodList = foodData?.data || [];
  const phongList = phongData?.data || [];

  // Tìm rapId từ phongId, memo để tránh tính lại không cần thiết
  const rapId = useMemo(() => {
    const phong = phongList.find((p: any) => p.id === phongId);
    return phong?.rap_id ?? null;
  }, [phongId, phongList]);

  // Lọc món ăn theo rapId, memo tránh tạo mới mỗi render
  const filteredFoodList = useMemo(() => {
    if (!rapId) return [];
    return foodList.filter((food: Food) => {
      const rapIds = Array.isArray(food.rap_id) ? food.rap_id : [food.rap_id];
      return rapIds.includes(rapId);
    });
  }, [foodList, rapId]);

  // State lưu số lượng món ăn
  const [foodQuantities, setFoodQuantities] = useState<Map<number, number>>(
    new Map()
  );

  // Reset số lượng món ăn khi filteredFoodList thay đổi
  useEffect(() => {
    const initialQuantities = new Map<number, number>();
    filteredFoodList.forEach((food: Food) => {
      initialQuantities.set(food.id, 0);
    });
    setFoodQuantities(initialQuantities);
  }, [filteredFoodList]);

  const getQuantity = (foodId: number): number =>
    foodQuantities.get(foodId) || 0;

  const handleQuantityChange = (food: Food, change: number) => {
    setFoodQuantities((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(food.id) || 0;
      const updated = Math.max(0, current + change);

      newMap.set(food.id, updated);
      onFoodQuantityChange({ ...food, quantity: updated });
      return newMap;
    });
  };

  if (isLoadingFoods) return <Spin />;

  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        border: "1px solid #333",
        borderRadius: 4,
        marginLeft: 20,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {filteredFoodList.map((food: Food) => {
          const quantity = getQuantity(food.id);
          return (
            <div
              key={food.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 4,
                padding: 12,
                width: "100%",
                boxSizing: "border-box",
                textAlign: "left",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={getImageUrl(food.image)}
                alt={food.ten_do_an}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 4,
                  marginRight: 12,
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ fontSize: 15, color: "black", paddingBottom: 5 }}
                >
                  {food.ten_do_an}
                </div>
                <div style={{ color: "#555", fontSize: 14,paddingBottom: 5  }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(food.gia_ban)}
                </div>

                <div style={{ color: "#555", fontSize: 10 }}>
                  Số lượng: {food.so_luong_ton}{" "}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                  backgroundColor: "#8B9DC3",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Button
                  onClick={(e) => {
                    handleQuantityChange(food, -1);
                    e.currentTarget.blur();
                  }}
                  size="small"
                  disabled={quantity === 0}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: quantity === 0 ? "#6A7A9A" : "#2C3E50",
                    width: 40,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                    cursor: quantity === 0 ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (quantity > 0)
                      e.currentTarget.style.backgroundColor = "yellow";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  −
                </Button>
                <div
                  style={{
                    minWidth: 40,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#2C3E50",
                  }}
                >
                  {quantity}
                </div>
                <Button
                  onClick={(e) => {
                    handleQuantityChange(food, 1);
                    e.currentTarget.blur();
                  }}
                  size="small"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#2C3E50",
                    width: 40,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "yellow";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodSelectionDisplay;
