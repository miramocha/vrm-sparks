import { Collapse } from "antd";
// import { Material as UniVRMMaterial } from "@pixiv/types-vrm-0.0";

// type SelectOptions = { label?: string; value: number };

export default function UniVRMMaterialEditor() {
  const accordionItems = [
    {
      key: "base",
      label: "Base",
      children: <div>TBD</div>,
    },
    {
      key: "shade",
      label: "Shade",
      children: <div>TBD</div>,
    },
    {
      key: "emission",
      label: "Emission",
      children: <div>TBD</div>,
    },
    {
      key: "rim-light",
      label: "Rim Light",
      children: <div>TBD</div>,
    },
    {
      key: "animation",
      label: "Animation",
      children: <div>TBD</div>,
    },
    {
      key: "json",
      label: "JSON",
      children: <code>{JSON.stringify({}, null, 2)}</code>,
    },
  ];

  return (
    <>
      UniVRM
      <Collapse accordion items={accordionItems} />
    </>
  );
}
