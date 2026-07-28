import type { Metadata } from "next";
import { CbsCityExplorer } from "../../components/cbs/CbsCityExplorer";

export const metadata: Metadata = {
  title: "CBS ile Şehri Keşfet | Co_LAB",
  description:
    "Konum, katman ve rota ilişkisini etkileşimli bir şehir üzerinde keşfedin.",
};

export default function CbsSehriKesfetPage() {
  return <CbsCityExplorer />;
}
