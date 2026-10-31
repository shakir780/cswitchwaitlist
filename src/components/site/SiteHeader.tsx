import { JoinButton } from "@/components/hero/JoinButton";
import { Logo } from "./Logo";
import { StickyHeader } from "./StickyHeader";

export function SiteHeader() {
  return (
    <StickyHeader>
      <div className="page-container flex h-[84px] items-center justify-between">
        <Logo />
        <JoinButton />
      </div>
    </StickyHeader>
  );
}
