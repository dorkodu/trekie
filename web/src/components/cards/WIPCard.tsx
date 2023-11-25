import Emoji from "../Emoji";
import StatusCard from "./StatusCard";

function WIPCard() {
  return (
    <StatusCard
      color="yellow"
      icon={<Emoji emoji="🚧" size={24} />}
      title="Work in progress">
      Hey, we are working hard on this feature. Stay tuned.
    </StatusCard>
  );
}

export default WIPCard;
