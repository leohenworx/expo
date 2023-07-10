import { DocsLogo, mergeClasses } from '@expo/styleguide';
import {
  PlanEnterpriseIcon,
  BookOpen02Icon,
  GraduationHat02Icon,
  Home02Icon,
  Hash02Icon,
} from '@expo/styleguide-icons';
import { Command } from 'cmdk';

import type { AlgoliaItemType } from '../types';
import {
  getContentHighlightHTML,
  getHighlightHTML,
  isReferencePath,
  isEASPath,
  openLink,
  isHomePath,
  isLearnPath,
} from '../utils';
import { FootnoteSection } from './FootnoteSection';
import { FootnoteArrowIcon } from './icons';
import { contentStyle, footnoteStyle, itemIconWrapperStyle } from './styles';

import versions from '~/public/static/constants/versions.json';
import { CALLOUT, FOOTNOTE } from '~/ui/components/Text';

const { LATEST_VERSION } = versions;

type Props = {
  item: AlgoliaItemType;
  onSelect?: () => void;
  isNested?: boolean;
};

type ItemIconProps = {
  url: string;
  className?: string;
  isNested?: boolean;
};

const isDev = process.env.NODE_ENV === 'development';

const ItemIcon = ({ url, className, isNested }: ItemIconProps) => {
  if (isNested) {
    return <Hash02Icon className={mergeClasses('icon-sm text-icon-tertiary', className)} />;
  } else if (isReferencePath(url)) {
    return <DocsLogo className={mergeClasses('text-icon-secondary', className)} />;
  } else if (isEASPath(url)) {
    return <PlanEnterpriseIcon className={mergeClasses('text-icon-secondary', className)} />;
  } else if (isHomePath(url)) {
    return <Home02Icon className={mergeClasses('text-icon-secondary', className)} />;
  } else if (isLearnPath(url)) {
    return <GraduationHat02Icon className={mergeClasses('text-icon-secondary', className)} />;
  }
  return <BookOpen02Icon className={mergeClasses('text-icon-secondary', className)} />;
};

const getFootnotePrefix = (url: string) => {
  if (isReferencePath(url)) {
    return 'Reference';
  } else if (isEASPath(url)) {
    return 'Expo Application Services';
  } else if (isHomePath(url)) {
    return 'Home';
  } else if (isLearnPath(url)) {
    return 'Learn';
  } else {
    return 'Guides';
  }
};

const ItemFootnotePrefix = ({ url, isNested = false }: { url: string; isNested?: boolean }) => {
  return isNested ? (
    <>
      <span css={footnoteStyle}>{getFootnotePrefix(url)}</span>
      <FootnoteArrowIcon />
    </>
  ) : (
    <FOOTNOTE css={footnoteStyle}>{getFootnotePrefix(url)}</FOOTNOTE>
  );
};

const transformUrl = (url: string) => {
  if (url.includes(LATEST_VERSION)) {
    url = url.replace(LATEST_VERSION, 'latest');
  }
  if (isDev) {
    url = url.replace('https://docs.expo.dev/', 'http://localhost:3002/');
  }
  return url;
};

export const ExpoDocsItem = ({ item, onSelect, isNested }: Props) => {
  const { lvl0, lvl2, lvl3, lvl4, lvl6 } = item.hierarchy;
  return (
    <Command.Item
      className={mergeClasses(isNested && 'ml-8 !min-h-[36px]')}
      value={`expodocs-${item.objectID}`}
      onSelect={() => {
        openLink(transformUrl(item.url));
        onSelect && onSelect();
      }}>
      <div className={mergeClasses('inline-flex items-center gap-3 break-words')}>
        <div css={itemIconWrapperStyle}>
          <ItemIcon url={item.url} isNested={isNested} />
        </div>
        <div>
          {lvl6 && (
            <>
              <CALLOUT weight="medium" {...getHighlightHTML(item, 'lvl6')} />
              {!isNested && (
                <FOOTNOTE css={footnoteStyle}>
                  <ItemFootnotePrefix url={item.url} isNested />
                  <span {...getHighlightHTML(item, 'lvl0')} />
                  <FootnoteSection item={item} levelKey="lvl2" />
                  <FootnoteSection item={item} levelKey="lvl3" />
                  <FootnoteSection item={item} levelKey="lvl4" />
                </FOOTNOTE>
              )}
            </>
          )}
          {!lvl6 && lvl4 && (
            <>
              <CALLOUT weight="medium" {...getHighlightHTML(item, 'lvl4')} />
              {!isNested && (
                <FOOTNOTE css={footnoteStyle} className={isNested ? '!hidden' : ''}>
                  <ItemFootnotePrefix url={item.url} isNested />
                  <span {...getHighlightHTML(item, 'lvl0')} />
                  <FootnoteSection item={item} levelKey="lvl2" />
                  <FootnoteSection item={item} levelKey="lvl3" />
                </FOOTNOTE>
              )}
            </>
          )}
          {!lvl6 && !lvl4 && lvl3 && (
            <>
              <CALLOUT weight="medium" {...getHighlightHTML(item, 'lvl3')} />
              {!isNested && (
                <FOOTNOTE css={footnoteStyle} className={isNested ? '!hidden' : ''}>
                  <ItemFootnotePrefix url={item.url} isNested />
                  <span {...getHighlightHTML(item, 'lvl0')} />
                  <FootnoteSection item={item} levelKey="lvl2" />
                </FOOTNOTE>
              )}
            </>
          )}
          {!lvl6 && !lvl4 && !lvl3 && lvl2 && (
            <>
              <CALLOUT weight="medium" {...getHighlightHTML(item, 'lvl2')} />
              {!isNested && (
                <FOOTNOTE css={footnoteStyle} className={isNested ? '!hidden' : ''}>
                  <ItemFootnotePrefix url={item.url} isNested />
                  <span {...getHighlightHTML(item, 'lvl0')} />
                </FOOTNOTE>
              )}
            </>
          )}
          {!lvl6 && !lvl4 && !lvl3 && !lvl2 && lvl0 && (
            <>
              <CALLOUT weight="medium" {...getHighlightHTML(item, 'lvl0')} />
              <ItemFootnotePrefix url={item.url} />
            </>
          )}
          {(!isNested || item.content) && (
            <FOOTNOTE theme="secondary" {...getContentHighlightHTML(item)} css={contentStyle} />
          )}
        </div>
      </div>
    </Command.Item>
  );
};
