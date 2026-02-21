const PageHeader = ({eyebrow, title, action}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-[10px] uppercase tracking-[0.3em] text-secondary sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold sm:text-xl lg:text-2xl">{title}</h3>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default PageHeader;






