import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconProp | null;
};

export const AdminPageHeader = ({ title, subtitle, icon }: Props) => {
  return (
    <div className="flex items-center justify-start gap-4">
      <h1 className="font-medium text-4xl uppercase text-slate-700 leading-4">
        {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
        {title}
      </h1>
      {subtitle && (
        <>
          <FontAwesomeIcon icon={faCaretRight} className="opacity-40" />
          <h2 className="font-light text-3xl opacity-40 leading-3 uppercase">{subtitle}</h2>
        </>
      )}
    </div>
  );
};
