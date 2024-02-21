import {useEffect, useState} from 'react';
import Header from "../components/Molecules/Header/Header";
import MarkdownBlock from "../components/Molecules/MarkdownBlock/MarkdownBlock";

function LegalMentions() {
  const [legalMentions, setLegalMentions] = useState("")

  useEffect(() => {
    // @ts-ignore
    import("/legal-mentions.md").then(res => {
      const url = res.default as unknown as string;
      fetch(url)
        .then(response => response.text())
        .then(md => setLegalMentions(md))
    });
  }, []);

  return (
    <div>
      <Header.Root type="page" center>
        <Header.Title>Mentions légales</Header.Title>
      </Header.Root>

      <div className="container-table-page">
        <MarkdownBlock>{legalMentions}</MarkdownBlock>
      </div>
    </div>
  );
}

export default LegalMentions;