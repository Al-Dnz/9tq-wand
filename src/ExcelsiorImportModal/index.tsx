/**
* transform: true
*/
// @ts-nocheck
import IModal, { configure, ImportModalContent  } from './ImportModal';

const ImportModal = IModal;
ImportModal.configure = configure;
export const ExcelsiorImportModalContent = ImportModalContent;
export default ImportModal;
