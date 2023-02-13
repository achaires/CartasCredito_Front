import { IBreadcrumb } from "@/interfaces";
import { Breadcrumb } from "flowbite-react";
import { Link } from "react-router-dom";

type Props = {
  links: IBreadcrumb[];
};

export const AdminBreadcrumbs = ({ links }: Props) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Cartas de Crédito</Breadcrumb.Item>
      {links.map((item, index) => (
        <Breadcrumb.Item key={index.toString()} href={item.href}>
          {item.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
