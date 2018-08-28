export const fallback = "en";

export const supportedLocales = {
  en: {
    name: "English",
    translationFileLoader: () => require("../lang/en.json"),

    // en is default locale in Moment
    momentLocaleLoader: () => Promise.resolve()
  },
  zh: {
    name: "中文",
    translationFileLoader: () => require("../lang/zh.json"),
    momentLocaleLoader: () => import("moment/locale/zh-cn")
  }
};

export const defaultNamespace = "common";

export const namespaces = ["common", "chatBaseList"];
