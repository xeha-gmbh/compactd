const changeCase = require('change-case');
const mkdirp = require('mkdirp');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

function writeTemplate (content, base, ...filename) {
  const sub = path.join(...filename);
  const target = path.join(base, sub);
  console.log(`  ${chalk.dim('Writing')} ${chalk.blue(sub)}`);
  fs.writeFileSync(target, content);
  console.log(`\n${content}`.split('\n').join('\n    '));
  console.log();

}

if (process.argv.includes('component')) {
  console.log();
  const feature = changeCase.camelCase(
    process.argv[process.argv.indexOf('component') + 1]);
  const name = process.argv[process.argv.indexOf('component') + 2];
  if (!feature) {
    return console.log(`  ${chalk.red('✗ Missing feature/component name')}`)
  }

  console.log(`  Generating component ${name} for ${feature}`);
  console.log();

  const base = path.join(__dirname, 'client/src/features');
  const pascalName = changeCase.pascalCase(name);

  const dir = path.join(base, feature, 'components', pascalName);
  console.log(chalk.dim(`  mkdirp  ${path.join(feature,
    'components', pascalName)}`));
  mkdirp.sync(dir);
  console.log();

  writeTemplate(`import * as React from 'react';
import {I${changeCase.pascalCase(feature)}Actions} from '../../actions.d';

require('./${pascalName}.scss');

interface I${pascalName}Props {
  actions: I${changeCase.pascalCase(feature)}Actions;
}

export class ${pascalName} extends React.Component<I${pascalName}Props, {}>{
  render (): JSX.Element {
    const {actions} = this.props;
    return <div className="${changeCase.paramCase(pascalName)}">
    </div>
  }
}`, base, feature, `${pascalName}.tsx`)

  writeTemplate(`export * from './${pascalName}';`, base, feature, 'index.tsx');

  writeTemplate(`div.${changeCase.paramCase(pascalName)}{

}
`, base, feature, `${pascalName}.scss`);
  console.log();
  console.log(chalk.green('  ✔ Done'))
}

if (process.argv.includes('feature')) {
  console.log();
  const name = process.argv[process.argv.indexOf('feature') + 1];
  if (!name) {
    return console.log(`  ${chalk.red('✗ Missing feature name')}`)
  }
  console.log(`  Generating feature ${name}`);
  console.log();

  const base = path.join(__dirname, 'client/src/features');
  const pascalName = changeCase.pascalCase(name);
  const folder = changeCase.camelCase(name);

  const dir = path.join(base, folder, 'components');
  console.log(chalk.dim(`  mkdirp  ${path.join(folder, 'components')}`))
  mkdirp.sync(dir);
  console.log();
  writeTemplate(`import * as Defs from 'definitions';
import { I${pascalName}Action } from './actions.d';

const initialState: Defs.I${pascalName}State = {
};

export function reducer (state: Defs.I${pascalName}State = initialState,
  action: I${pascalName}Action): Defs.I${pascalName}State {
  switch (action.type) {
  }
  return state;
}
export const actions = {
}`, base, folder, `${folder}.tsx`);

  writeTemplate(`import {IArtist, IAlbum} from 'definitions';

interface I${pascalName}ActionBase {
  type: string;
};

export type I${pascalName}Action = {};

export type I${pascalName}Actions = {
  action1: (<params>) => void;
}
`, base, folder, `actions.d.tsx`);

  writeTemplate(`export {reducer} from './${name}'; `, base, folder, 'index.tsx');

  writeTemplate(`import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import {actions} from '../${folder}';
import {I${pascalName}Actions, I${pascalName}Action} from '../actions.d';
import {I${pascalName}State, ICompactdState} from 'definitions';

interface I${pascalName}ViewProps {
  actions: I${pascalName}Actions;
  ${folder}: I${pascalName}State;
}

@(connect as any)(createStructuredSelector({
  ${folder}: (state: ICompactdState) => state.${folder}
}), (dispatch: Dispatch<I${pascalName}Action>) => ({
  actions: bindActionCreators(actions, dispatch)
}))
class ${pascalName}View extends React.Component<I${pascalName}ViewProps, {}> {
  render (): JSX.Element {
    return <div className="${changeCase.paramCase(`${name}View`)}"></div>;
  }
}

export default ${pascalName}View as any;`, base, folder, `components/${pascalName}View.tsx`);
  console.log();
  console.log(chalk.green('  ✔ Done'))
}
