const Card = ({title, value, meta}) => {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-[0.3em] text-secondary">{title}</p>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-semibold">{value}</span>
        {meta ? <span className="text-xs text-secondary">{meta}</span> : null}
      </div>
    </div>
  );
};

export default Card;






