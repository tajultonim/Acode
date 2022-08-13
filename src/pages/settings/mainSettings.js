import tag from 'html-tag-js';
import Page from '../../components/page';
import gen from '../../components/gen';
import About from '../about/about';
import editorSettings from './editorSettings';
import constants from '../../lib/constants';
import openFile from '../../lib/openFile';
import backupRestore from './backup-restore';
import themeSetting from '../themeSetting/themeSetting';
import otherSettings from './appSettings';
import defaultFormatter from './defaultFormatter';
import $_socialLinks from '../../views/social-links.hbs';
import rateBox from '../../components/dialogboxes/rateBox';
import Donate from '../donate/donate';
import helpers from '../../lib/utils/helpers';
import plugins from '../plugins/plugins';

export default function settingsMain() {
  const $page = Page(strings.settings.capitalize());
  const $settingsList = tag('div', {
    className: 'main list',
    style: {
      textTransform: 'capitalize',
    },
  });
  const $editSettings = tag('span', {
    className: 'icon edit',
    attr: {
      style: 'font-size: 1.2em !important;',
      action: 'edit-settings',
    },
    onclick: () => {
      openFile(appSettings.settingsFile, {
        text: JSON.stringify(appSettings.value, undefined, 4),
        render: true,
        isUnsaved: false,
      }).then(() => {
        actionStack.pop();
      });
    },
  });

  actionStack.push({
    id: 'settings-main',
    action: $page.hide,
  });
  $page.header.append($editSettings);

  const settingsOptions = [
    {
      key: 'about',
      text: strings.about,
      icon: 'acode',
    },
    {
      key: 'donate',
      text: strings.support,
      icon: 'favorite',
      color: 'orangered',
      sake: true
    },
    {
      key: 'editor-settings',
      text: strings['editor settings'],
      icon: 'text_format',
    },
    {
      key: 'app-settings',
      text: strings['app settings'],
      icon: 'tune',
    },
    {
      key: 'formatter',
      text: strings.formatter,
      icon: 'stars',
    },
    {
      key: 'theme',
      text: strings.theme,
      icon: 'color_lenspalette',
    },
    {
      key: 'backup-restore',
      text: strings.backup.capitalize() + '/' + strings.restore.capitalize(),
      icon: 'cached',
    },
    {
      key: 'rateapp',
      text: strings['rate acode'],
      icon: 'googleplay'
    },
    {
      key: 'plugins',
      text: strings['plugins'],
      icon: 'extension',
    }
  ];

  if (IS_FREE_VERSION) {
    settingsOptions.push({
      index: 9,
      key: 'removeads',
      text: strings['remove ads'],
      icon: 'cancel',
    });
  }

  gen.listItems($settingsList, settingsOptions, changeSetting);

  function changeSetting() {
    const lanuguages = [];
    const langList = constants.langList;
    for (let lang in langList) {
      lanuguages.push([lang, langList[lang]]);
    }
    switch (this.key) {
      case 'editor-settings':
        editorSettings();
        break;

      case 'theme':
        themeSetting();
        break;

      case 'about':
        About();
        break;

      case 'app-settings':
        otherSettings();
        break;

      case 'backup-restore':
        backupRestore();
        break;

      case 'donate':
        Donate();
        break;

      case 'rateapp':
        rateBox();
        break;

      case 'plugins':
        plugins();
        break;

      case 'formatter':
        defaultFormatter();
        break;

      case 'removeads':
        system.openInBrowser(constants.PAID_VERSION);
        break;

      default:
        break;
    }
  }

  $page.body = $settingsList;
  $settingsList.appendChild(tag.parse($_socialLinks));
  app.append($page);
  helpers.showAd();

  $page.onhide = function () {
    helpers.hideAd();
    actionStack.remove('settings-main');
  };
}
