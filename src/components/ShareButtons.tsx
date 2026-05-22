import {
  XShareButton,
  XIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";

type Props = { title: string };

export default function ShareButtons({ title }: Props) {
  const url = window.location.href;
  const size = 32;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0.4rem" }}>
      <XShareButton url={url} title={title}>
        <XIcon size={size} round />
      </XShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={size} round />
      </LinkedinShareButton>
    </div>
  );
}
