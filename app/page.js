import { getMedia } from "../lib/media";
import Portfolio from "../components/Portfolio";

export default function Page() {
  return <Portfolio media={getMedia()} />;
}
