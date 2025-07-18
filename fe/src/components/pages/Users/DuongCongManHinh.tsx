const DuongCongManHinh = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <svg
        width="100%"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        style={{ display: "block", minHeight: "50px" }}
      >
        <path
          d="M10,90 Q500,-40 990,90"
          stroke="white"
          strokeWidth="6"
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>
      <h2
        style={{
          fontFamily: "Alata, sans-serif",
          color: "#fff",
          fontWeight: 100,
          fontSize: 22,
          marginTop: -50,
        }}
      >
        Màn hình
      </h2>
    </div>
  );
};

export default DuongCongManHinh;
