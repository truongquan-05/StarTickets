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
      padding: 24,
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      // minHeight: "100vh",
    }}
  >
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
      gap: 20,
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      {filteredFoodList.map((food) => {
        const quantity = getQuantity(food.id);
        return (
          <div
            key={food.id}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(226, 232, 240, 0.6)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <img
                  src={getImageUrl(food.image)}
                  alt={food.ten_do_an}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "2px solid #f1f5f9",
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: "#10b981",
                  color: "white",
                  fontSize: 11,
                  fontWeight: "600",
                  padding: "4px 8px",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
                }}>
                  {food.so_luong_ton}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: "600", 
                  color: "#1e293b", 
                  margin: "0 0 8px 0",
                  lineHeight: "1.3"
                }}>
                  {food.ten_do_an}
                </h3>
                
                <div style={{ 
                  fontSize: 20, 
                  fontWeight: "700", 
                  color: "#059669", 
                  marginBottom: 8 
                }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(food.gia_ban)}
                </div>
                
                <p style={{ 
                  fontSize: 13, 
                  color: "#64748b", 
                  margin: "0 0 16px 0",
                  lineHeight: "1.4",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {food.mo_ta}
                </p>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  {/* <span style={{ fontSize: 12, color: "#94a3b8" }}>Số lượng</span> */}
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f8fafc",
                    borderRadius: 12,
                    padding: 4,
                    border: "1px solid #e2e8f0"
                  }}>
                    <Button
                      onClick={(e) => {
                        handleQuantityChange(food, -1);
                        e.currentTarget.blur();
                      }}
                      size="small"
                      disabled={quantity === 0}
                      style={{
                        backgroundColor: quantity === 0 ? "#f1f5f9" : "white",
                        border: "none",
                        color: quantity === 0 ? "#94a3b8" : "#475569",
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: 16,
                        cursor: quantity === 0 ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        outline: "none",
                        boxShadow: quantity === 0 ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        if (quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#fef2f2";
                          e.currentTarget.style.color = "#dc2626";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (quantity > 0) {
                          e.currentTarget.style.backgroundColor = "white";
                          e.currentTarget.style.color = "#475569";
                        }
                      }}
                    >
                      −
                    </Button>
                    
                    <div style={{
                      minWidth: 36,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#1e293b",
                    }}>
                      {quantity}
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        handleQuantityChange(food, 1);
                        e.currentTarget.blur();
                      }}
                      size="small"
                      style={{
                        backgroundColor: "white",
                        border: "none",
                        color: "#475569",
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: 16,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        outline: "none",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f0fdf4";
                        e.currentTarget.style.color = "#16a34a";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "#475569";
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default FoodSelectionDisplay;
