import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

interface Props {
  str: string;
}

const PrismPreJson = ({str}: Props) => {
  return (
    <pre
      style={{ display: 'inline' }}
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(str, Prism.languages.json, 'json'),
      }}
    />
  )
}

export default PrismPreJson