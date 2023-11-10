import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useFormFilled from "../../hooks/useFormFilled.js";
import Input from "../../components/forms/Input/index.jsx";
import Textarea from "../../components/forms/Textarea/index.jsx";
import Dropdown from "../../components/forms/Dropdown/index.jsx";
import {useEffect, useState} from "react";
import Checkbox from "../../components/forms/Checkbox/index.jsx";
import AutocompleteInput
  from "../../components/forms/AutocompleteInput/index.jsx";
import Option from "../../components/forms/Option/index.jsx";
import Selector from "../../components/forms/Selector/index.jsx";
import {floreFetch} from "../../api/axios.js";
import {deleteDublicates} from "../../utils.js";
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import Button from "../../components/Buttons/Button.jsx";
import useAuth from "../../hooks/auth/useAuth.js";
import {useFetch} from "../../hooks/useFetch.js";
import Loader from "../../components/Loader/index.jsx";
import error from "../Error.jsx";
import {navigate} from "@storybook/addon-links";


function CreateQuiz(props) {
  const {user} = useAuth()
  const privateFetch = usePrivateFetch()
  const location = useLocation()
  const fromLocation = location?.state?.from?.pathname || '/menu'
  const navigate = useNavigate()

  const [responseHelper, setResponseHelper] = useState({})
  const {launchRequest: launchFloreImageFetch, data: plantImagesData, loading: plantImagesLoading, errors: errors} = useFetch({
    fetchFunc: floreFetch,
    method: "GET",
  })
  const {launchRequest: createQuiz, data: createQuizResponseData, loading: createQuizLoading} = useFetch({
    fetchFunc: privateFetch,
    method: "POST",
    setHelper: setResponseHelper,
  })

  const {formRef, handleFormChange, isFilled} = useFormFilled()

  const [plantValue, setPlantValue] = useState(null)
  const [plantIsValid, setPlantIsValid] = useState(false)
  const [plantImages, setPlantImages] = useState(null)
  const [imageValue, setImageValue] = useState(null)

  // get all image urls for autocomplete input
  useEffect(() => {
    if (plantIsValid) {
      launchFloreImageFetch(`/api/images?plant__french_name=${plantValue}`)
    }
  }, [plantIsValid]);

  // set plant images to an array of images
  useEffect(() => {
    if (plantImagesData) {
      setPlantImages(prev => deleteDublicates(plantImagesData.results.map(data => data.url.replace('L', 'CRS'))))
    }
  }, [plantImagesData]);

  useEffect(() => {
    if (!createQuizLoading && createQuizResponseData) {
      console.log(createQuizResponseData)
      navigate(`/quiz/create/plants/${createQuizResponseData.id}`, {state: createQuizResponseData })
    }
  }, [createQuizLoading]);

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);

    console.log(user)

    createQuiz('/api/quizzes', {
      name: formData.get('name'),
      description: formData.get('description'),
      difficulty: formData.get('difficulty'),
      preview_image_url: formData.get('preview-image-url'),
      private: formData.get('private') ? formData.get('private') : false,
      user: localStorage.getItem("USER-ID"),
    })

  }

  useEffect(() => {
    console.log("err", errors)
  }, [errors]);

   return (
    <div className="container center">
      <form ref={formRef} className="form-page" onSubmit={handleFormSubmit} onChange={(e) => handleFormChange(e.target)}>
        <div className="form-header">
          <h1>Creation d'un quiz</h1>
        </div>
        <Input
          id="name"
          label="Nom"
          type="text"
          size="big"
        />
        <Textarea
          id="description"
          label="Description"
          maxLenght={500}
          mb="1rem"
        />
        <Dropdown
          inputId="difficulty"
          label="Difficulté"
          size="big"
          mb="1rem"
        >
          <Option>1</Option>
          <Option>2</Option>
          <Option>3</Option>
        </Dropdown>
        {imageValue === null && <>
          <AutocompleteInput
            label="Nom d'une plante"
            size="big"
            url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
            fieldName="french_name"
            maxSuggestions={5}
            handleValueChange={setPlantValue}
            setValidValue={setPlantIsValid}
            usageInfoText="Cherche le nom d’une plante, puis choisie l’image
            de la plante qui te semble la mieux. Choisie la bien car c'est
            elle qui servira d'image de couverture au quiz."
          />
        </>
        }
        {plantIsValid && <div>
          {plantImages !== null ? <Selector
            inputId="preview-image-url"
            choices={plantImages}
            choiceType="img"
            setValue={setImageValue}
          /> :
            <p>Chargement des images</p>
          }
        </div>}
        <Checkbox
          id="private"
          label="Privé"
          takeValue="true"
          style={{marginBottom: '1rem'}}
        />
        <div className="two-buttons">
          <ButtonLink
            to={fromLocation}
            label="Retour"
            size="big"
            color="secondary"
            variant="soft"
            fill
          />
          <Button
            label="Continuer"
            size="big"
            type="submit"
            color="primary"
            disabled={!isFilled}
            loading={createQuizLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;