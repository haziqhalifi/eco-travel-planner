function CarbonCalculator() {
  return (
    <div
      className="min-vh-100 py-8"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto my-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="mb-4 text-center">Carbon Footprint Calculator</h1>
          {/* Calculator content goes here */}
        </div>
      </div>
    </div>
  );
}

export default CarbonCalculator;
