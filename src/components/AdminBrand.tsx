import brandImg from "@/assets/img/gis-logo-gris.png";

type Props = {
  showSidebar: boolean;
};

export const AdminBrand = ({ showSidebar = false }: Props) => {
  return (
    <aside id="dashboard__brand" className={showSidebar ? "active" : ""}>
      <img src={brandImg} />
    </aside>
  );
};
