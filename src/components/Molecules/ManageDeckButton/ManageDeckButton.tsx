import "./ManageDeckButton.scss";
import { DeckType } from "../../../services/api/types/decks";
import Button from "../../Atoms/Buttons/Button";
import { Edit, Lock } from "react-feather";
import Flower from "../../Atoms/Icons";
import { Link } from "react-router-dom";

type ManageDeckButtonProps = {
  deck: DeckType;
};

function ManageDeckButton({ deck }: ManageDeckButtonProps) {
  return (
    <div className="manage-deck-button">
      <div className="img-container">
        <img src={deck.preview_image_url} alt="preview image" />
      </div>
      <div className="flex center">
        <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
        {deck.private && <Lock className="ml-1" size={15} />}
      </div>

      <div>
        <Button asChild onlyIcon color="gray" bounce={false}>
          <Link to={`/decks/${deck.id}/plants`}>
            <Flower />
          </Link>
        </Button>
        <Button asChild onlyIcon color="gray" bounce={false}>
          <Link to={`/decks/${deck.id}/update`}>
            <Edit />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default ManageDeckButton;