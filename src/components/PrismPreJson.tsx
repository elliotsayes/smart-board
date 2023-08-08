import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { useMemo } from 'react';

interface Props {
  str: string;
}

const PrismPreJson = ({str}: Props) => {
  const html = useMemo(
    () => Prism.highlight(str, Prism.languages.json, 'json'),
    [str],
  );

  return (
    <pre
      style={{ display: 'inline' }}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}

export default PrismPreJson