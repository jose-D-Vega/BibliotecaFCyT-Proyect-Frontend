import "./styles/LibroInfoItem.css";

function LibroInfoItem({ label, value, full }) {
  return (
    <div className={`info-item ${full ? "full" : ""}`}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

export default LibroInfoItem;