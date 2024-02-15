import { useEffect, useState } from "react";
import Header from "../../components/Molecules/Header/Header";
import Switch from "../../components/Atoms/Switch/Switch/Switch";
import Dropdown from "../../components/Molecules/Dropdown/Dropdown";
import Option from "../../components/Atoms/Option/Option";
import ChoiceBlock from "../../components/Molecules/ChoiceBlock/ChoiceBlock";
import { useQuery } from "@tanstack/react-query";
import { flore } from "../../services/api/flore";
import { PlantType } from "../../services/api/types/plants";
import { SettingsType } from "../../types/helpers";
import { ErrorBoundary } from "react-error-boundary";

function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    showRankingTab: false,
    switchingGardenSection: false,
    buttonsSound: false,
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // set default settings values if they don't exists
    if (localStorage.getItem("settings.showRankingTab") === null) {
      localStorage.setItem("settings.showRankingTab", "false");
    }
    if (localStorage.getItem("settings.switchingGardenSection") === null) {
      localStorage.setItem("settings.switchingGardenSection", "false");
    }
    if (localStorage.getItem("settings.buttonsSound") === null) {
      localStorage.setItem("settings.buttonsSound", "false");
    }
    setSettings({
      showRankingTab: JSON.parse(
        localStorage.getItem("settings.showRankingTab") as string,
      ),
      switchingGardenSection: JSON.parse(
        localStorage.getItem("settings.switchingGardenSection") as string,
      ),
      buttonsSound: JSON.parse(
        localStorage.getItem("settings.buttonsSound") as string,
      ),
    });
    setShowSettings(true);
  }, []);

  function switchSettings(value: boolean, settingsName: keyof SettingsType) {
    setSettings({
      ...settings,
      [settingsName]: value,
    });
    localStorage.setItem(
      `settings.${settingsName}`,
      (!settings[settingsName]).toString(),
    );
  }

  return (
    <div>
      <Header.Root type="page">
        <Header.Title>Paramètres</Header.Title>
      </Header.Root>

      {showSettings && (
        <>
          <div className="content-container">
            <Switch
              className="mb-1"
              label="Afficher l’onglet du classement"
              takeValue={true}
              value={settings.showRankingTab as boolean}
              handleValueChange={(value) =>
                switchSettings(value as boolean, "showRankingTab")
              }
            />
            <Switch
              className="mb-1"
              label="Intervertir les sections dans Mon Jardin"
              takeValue={true}
              value={settings.switchingGardenSection}
              handleValueChange={(value) =>
                switchSettings(value as boolean, "switchingGardenSection")
              }
            />
            <Switch
              label="Son des boutons"
              takeValue={true}
              value={settings.buttonsSound}
              handleValueChange={(value) =>
                switchSettings(value as boolean, "buttonsSound")
              }
            />
          </div>

          <ButtonInfoSection />
        </>
      )}
    </div>
  );
}

function ButtonInfoSection() {
  const [title, setTitle] = useState<keyof PlantType>("french_name");
  const [subTitle, setSubTitle] = useState<keyof PlantType>("scientific_name");

  const randomPlantQuery = useQuery({
    queryKey: ["randomPlant"],
    queryFn: () =>
      flore.plants.random({
        number: 1,
      }),
  });

  const translation: Record<keyof PlantType, string> = {
    id: "",
    rank_code: "",
    family_id: "",
    genre_id: "",
    scientific_name: "Nom scientifique",
    correct_name: "Nom correct",
    french_name: "Nom français",
    num_inpn: "Numéro Inpn",
    author: "",
    publ_date: "",
    eflore_url: "",
  };

  // default values
  useEffect(() => {
    if (localStorage.getItem("settings.gameButtonInfo")) {
      const { title, subtitle } = JSON.parse(
        localStorage.getItem("settings.gameButtonInfo")!,
      );
      setTitle(title);
      setSubTitle(subtitle);
    } else {
      localStorage.setItem(
        "settings.gameButtonInfo",
        JSON.stringify({
          title: "french_name",
          subtitle: "scientific_name",
        }),
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "settings.gameButtonInfo",
      JSON.stringify({
        title: title,
        subtitle: subTitle,
      }),
    );
  }, [title, subTitle]);

  return (
    <>
      <Header.Root type="sub-section">
        <Header.Title>Modifier les infos des boutons en jeu</Header.Title>
      </Header.Root>

      <div className="content-container">
        <ErrorBoundary fallback={<p>Une erreur est survenu</p>}>
          <form style={{ maxWidth: "400px" }}>
            <Dropdown
              label="Titre"
              defaultValue={
                translation[
                JSON.parse(localStorage.getItem("settings.gameButtonInfo")!)
                  ?.title as keyof PlantType
                ] as string
              }
              handleValueChange={(value) => {
                setTitle(value as keyof PlantType);
              }}
            >
              <Option value="scientific_name">Nom scientifique</Option>
              <Option value="correct_name">Nom correct</Option>
              <Option value="french_name">Nom français</Option>
              <Option value="num_inpn">Numéro Inpn</Option>
            </Dropdown>

            <Dropdown
              label="Sous titre"
              defaultValue={
                translation[
                JSON.parse(localStorage.getItem("settings.gameButtonInfo")!)
                  ?.subtitle as keyof PlantType
                ]
              }
              handleValueChange={(value) => {
                setSubTitle(value as keyof PlantType);
              }}
            >
              <Option value="scientific_name">Nom scientifique</Option>
              <Option value="correct_name">Nom correct</Option>
              <Option value="french_name">Nom français</Option>
              <Option value="num_inpn">Numéro Inpn</Option>
            </Dropdown>
          </form>

          <h4 className="mb-1 mt-1">Aperçu</h4>

          {randomPlantQuery.isSuccess && (
            <div style={{ maxWidth: "400px" }}>
              <ChoiceBlock
                title={randomPlantQuery.data[0][title] as string}
                subtitle={randomPlantQuery.data[0][subTitle] as string}
                isRightAnswer={true}
                showResult={false}
                setShowResult={() => false}
              />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
}

export default Settings;