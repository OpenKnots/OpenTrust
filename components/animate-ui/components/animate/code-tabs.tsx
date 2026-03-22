'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/animate-ui/components/buttons/copy';

type CodeTabsProps = React.ComponentProps<'div'> & {
  codes: Record<string, string>;
  lang: string;
};

const EXT_TO_LANG: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  json: 'json',
  sh: 'bash',
  bash: 'bash',
  css: 'css',
  html: 'html',
  md: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  py: 'python',
  rs: 'rust',
  go: 'go',
};

function inferLang(tabName: string, fallback: string): string {
  const ext = tabName.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_LANG[ext] ?? fallback;
}

function CodeTabs({ className, codes, lang, ...props }: CodeTabsProps) {
  const keys = React.useMemo(() => Object.keys(codes), [codes]);
  const [activeTab, setActiveTab] = React.useState(keys[0] ?? '');
  const [html, setHtml] = React.useState('');
  const activeCode = codes[activeTab] ?? '';
  const activeLang = inferLang(activeTab, lang);

  React.useEffect(() => {
    if (!activeCode) return;
    let cancelled = false;

    import('shiki').then(({ codeToHtml }) =>
      codeToHtml(activeCode.trim(), {
        lang: activeLang,
        theme: 'vitesse-dark',
      }),
    ).then((result) => {
      if (!cancelled) setHtml(result);
    }).catch(() => {
      if (!cancelled) setHtml('');
    });

    return () => { cancelled = true; };
  }, [activeCode, activeLang]);

  if (keys.length === 0) return null;

  return (
    <div className={cn('aui-code-tabs', className)} {...props}>
      <div className="aui-code-tabs__header">
        <div className="aui-code-tabs__tabs" role="tablist">
          {keys.map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={key === activeTab}
              className={cn(
                'aui-code-tabs__tab',
                key === activeTab && 'aui-code-tabs__tab--active',
              )}
              onClick={() => setActiveTab(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <CopyButton className="aui-code-tabs__copy" content={activeCode} />
      </div>
      <div className="aui-code-tabs__body">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="aui-code-tabs__panel"
            role="tabpanel"
          >
            {html ? (
              <div
                className="aui-code-tabs__code"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="aui-code-tabs__code aui-code-tabs__code--fallback">
                <code>{activeCode.trim()}</code>
              </pre>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { CodeTabs, type CodeTabsProps };
