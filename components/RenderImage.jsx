import Image from "next/image";
export default function RenderImage({ image, ...props }) {
  if (!image || !image.asset || !image.asset.url) {
    return <div aria-hidden className={props.className} />;
  }

  const { url, metadata = {} } = image.asset;
  const { width, height } = metadata.dimensions || {};
  const toPass = { ...props };
  if (!props.fill && width && height) {
    toPass.width = width;
    toPass.height = height;
  }

  const hasLqip = !!metadata?.lqip;
  return (
    <Image
      key={url}
      src={url}
      alt=""
      {...toPass}
      {...(hasLqip ? { placeholder: "blur", blurDataURL: metadata.lqip } : {})}
      style={{
        objectFit: props.fill ? "cover" : "contain",
      }}
    />
  );
}
