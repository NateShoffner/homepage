import { Helmet } from "react-helmet-async";

const SITE_NAME = "Nate Shoffner";

interface Props {
  title?: string;
}

const PageHelmet = ({ title }: Props) => (
  <Helmet
    title={title}
    titleTemplate={`%s • ${SITE_NAME}`}
    defaultTitle={SITE_NAME}
  />
);

export default PageHelmet;
