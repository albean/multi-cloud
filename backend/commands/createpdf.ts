import { renderPdf } from "backend/services/pdf/render";

// @TEMP This a debug command, expected to be removed in final version
export const createpdf = async () => {
  const out = await renderPdf({
    EVENT_NAME: "Moj event".toUpperCase(),
    USER_NAME: "Andrzej Duda".toUpperCase(),
    DATE: "20.12.2025".toUpperCase(),
  });

  console.log(out)
};
