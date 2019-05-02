import React from 'react';
import tnt from 'tntvis';
import board from 'tnt.genome';
import cttvApi from 'cttv.api';
import targetGenomeBrowser from 'cttv.genome';

class VariationDetail extends React.Component {
  componentDidMount() {
    const { ensgId } = this.props;
    const browser = board
      .genome()
      .species('human')
      .gene(ensgId)
      .context(20)
      .width(800);

    browser
      .rest()
      .prefix('')
      .protocol('https')
      .domain('rest.ensembl.org');

    const api = cttvApi()
      .prefix('https://platform-api.opentargets.io')
      // .prefix('/api/')

      // .prefix("/api/")
      // .prefix('http://127.0.0.1:8123/api/')
      // .prefix("https://www.targetvalidation.org/api/")
      // .version('latest')
      // .appname('cttv-web-app')
      // .secret('2J23T20O31UyepRj7754pEA2osMOYfFK')
      .verbose(false);

    const theme = targetGenomeBrowser()
      .efo(null)
      .cttvRestApi(api);

    theme(browser, document.getElementById('otTargetGenomeBrowser'));
  }
  render() {
    return <div id="otTargetGenomeBrowser" />;
  }
}

export default VariationDetail;
