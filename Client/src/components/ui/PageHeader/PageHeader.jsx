const PageHeader = ({eyebrow, title, action}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>
        ) : null}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default PageHeader;



