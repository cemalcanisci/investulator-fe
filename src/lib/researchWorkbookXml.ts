import JSZip from 'jszip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import type { Element } from '@xmldom/xmldom';

const MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

/** Normalize namespace aliases only; ExcelJS remains the sole worksheet reader. */
export async function normalizeWorkbookXml(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const zip = await JSZip.loadAsync(buffer, { checkCRC32: true });
  if (!zip.file('xl/workbook.xml') || !zip.file('[Content_Types].xml')) {
    throw new Error('format');
  }
  let changed = false;
  for (const entry of Object.values(zip.files)) {
    if (entry.dir || !entry.name.endsWith('.xml')) {
      continue;
    }
    const xml = await entry.async('string');
    if (/<!DOCTYPE|<!ENTITY/i.test(xml)) {
      throw new Error('format');
    }
    // Unprefixed exports need no serialization, preserving the normal fast path.
    if (
      !/xmlns:[\w.-]+=["']http:\/\/schemas.openxmlformats.org\/spreadsheetml\/2006\/main["']/.test(
        xml,
      )
    ) {
      continue;
    }
    const document = new DOMParser({
      onError: (): never => {
        throw new Error('corrupt');
      },
    }).parseFromString(xml, 'application/xml');
    function normalize(element: Element): void {
      let target = element;
      if (element.namespaceURI === MAIN && element.prefix) {
        target = document.createElementNS(MAIN, element.localName ?? '');
        for (let index = 0; index < element.attributes.length; index++) {
          const attribute = element.attributes.item(index);
          if (attribute) {
            target.setAttributeNS(
              attribute.namespaceURI,
              attribute.name,
              attribute.value,
            );
          }
        }
        while (element.firstChild) {
          target.appendChild(element.firstChild);
        }
        element.parentNode?.replaceChild(target, element);
      }
    }
    Array.from(document.getElementsByTagName('*')).forEach(normalize);
    zip.file(entry.name, new XMLSerializer().serializeToString(document));
    changed = true;
  }
  return changed
    ? zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' })
    : buffer;
}
