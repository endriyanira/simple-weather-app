// custom.d.ts or declarations.d.ts

// This line tells TypeScript that any import ending in .css
// is okay, and it should treat it as a module that exports nothing
// (which is correct for a side-effect import).
declare module "*.css" {
  const content: any;
  export default content;
}

// If you also import other non-TS files like images, you might add:
// declare module "*.png";
// declare module "*.svg";
// declare module "*.jpg";
