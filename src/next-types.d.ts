declare module "next/types.js" {
  export type ResolvingMetadata = import("next").ResolvingMetadata;
  export type ResolvingViewport = any;
}

declare module "next/server.js" {
  export { NextRequest, NextResponse } from "next/server";
}
