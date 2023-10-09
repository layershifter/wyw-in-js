function asIs(source) {
  return source;
}

function babelCommonJS(source) {
  const babel = require('@babel/core');

  const result = babel.transformSync(source, {
    babelrc: false,
    configFile: false,
    filename: __dirname + '/source.ts',
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: 'ie 11',
        },
      ],
      '@babel/preset-typescript',
    ],
  });

  return result?.code ?? '';
}

function babelNode16(source) {
  const babel = require('@babel/core');
  const result = babel.transformSync(source, {
    babelrc: false,
    configFile: false,
    filename: __dirname + '/source.ts',
    presets: [
      [
        '@babel/preset-typescript',
        {
          onlyRemoveTypeImports: true,
        },
      ],
    ],
  });

  return result?.code ?? '';
}

function esbuildCommonJS(source) {
  const esbuildTransformSync = require('esbuild').transformSync;
  const result = esbuildTransformSync(source, {
    format: 'cjs',
    loader: 'ts',
    sourcefile: __dirname + '/source.ts',
    target: 'es2015',
  });

  return result.code;
}

function swcCommonJSES5(source) {
  const swcTransformSync = require('@swc/core').transformSync;
  const result = swcTransformSync(source, {
    filename: __dirname + '/source.ts',
    jsc: {
      target: 'es5',
    },
    module: {
      type: 'commonjs',
    },
  });

  return result.code;
}

function swcCommonJSES2015(source) {
  const swcTransformSync = require('@swc/core').transformSync;
  const result = swcTransformSync(source, {
    filename: __dirname + '/source.ts',
    jsc: {
      target: 'es2015',
    },
    module: {
      type: 'commonjs',
    },
  });

  return result.code;
}

function typescriptCommonJS(source) {
  const ts = require('typescript');
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });

  return result.outputText;
}

function typescriptES2022(source) {
  const ts = require('typescript');
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022 },
  });

  return result.outputText;
}

export const configs = [
  {
    name: 'as-is',
    transformers: [asIs],
  },
  {
    name: '@babel/core',
    transformers: [
      {
        fn: babelCommonJS,
        deps: ['@babel/preset-env:7.12.1', '@babel/preset-typescript:7.12.1'],
      },
      {
        fn: babelNode16,
        deps: ['@babel/preset-typescript:7.12.1'],
      },
    ],
    version: '>=7',
  },
  {
    name: '@swc/core',
    transformers: [swcCommonJSES5, swcCommonJSES2015],
    version: '>=1.2.41', // Earlier versions require @swc/core-darwin
  },
  {
    name: 'esbuild',
    transformers: [esbuildCommonJS],
    version: '>=0.8.17', // Earlier versions fail to run postinstall script
  },
  {
    name: 'typescript',
    transformers: [typescriptCommonJS, typescriptES2022],
    version: '>=2.0',
  },
];
