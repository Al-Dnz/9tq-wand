---
title: useI18n
nav:
  title: API
  order: -1
group:
  title: Utils
  order: 3
---

# useI18n

Ce hook permet d'afficher la traduction d'une clé, il peut être utilisé en parallèle de la Toolbar pour afficher une popup permettant de remplir les traductions manquantes directement depuis l'interface

:::info{title=INFORMATIONS}
Afin de faire fonctionner useI18n, il faut au préalable suivre l'installation de [react-intl - Documentation](https://formatjs.io/docs/getting-started/installation)
:::

## Usage

```tsx | pure
import { useI18n } from '@9troisquarts/wand';

export const () => {
  const {
    t, // Prend une clé en parmètre pour retourner la trad
    tAttribute, // Prend le nom du model comme premier paramètre et le champ à traduire en deuxième, la clé utilisé sera activerecord.attributes.model.field
    isTranslated, // Retourne true ou false, déterminé si une chaîne de caractères a été traduite ou non
  } = useI18n();

  return (
    <div>
      {isTranslated('words.name') ? t('words.name') : 'Missing translation'}
      {tAttribute('user', 'name')}
    </div>
  )
}

```
