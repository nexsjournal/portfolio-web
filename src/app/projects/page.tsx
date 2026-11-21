import { ProjectsPage } from "@/components/sections/projects-page";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  path: "/projects",
  title: "独立开发作品与产品设计案例｜Lex Ray",
  description: "浏览 Lex Ray 的项目：旅行路线动画、相册整理、实时海拔、待办记录、Mac 录屏剪辑、素材管理和多平台内容运营。查看各项目的功能、界面与试用入口。",
});

export default function Projects() {
  return <ProjectsPage />;
}
