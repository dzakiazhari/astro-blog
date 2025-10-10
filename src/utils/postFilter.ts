import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

type PostFilterOptions = {
  now?: number;
  isDev?: boolean;
};

const postFilter = (
  { data }: CollectionEntry<"blog">,
  {
    now = Date.now(),
    isDev = import.meta.env?.DEV ?? false,
  }: PostFilterOptions = {},
) => {
  const isPublishTimePassed =
    now > new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;

  return !data.draft && (isDev || isPublishTimePassed);
};

export default postFilter;
