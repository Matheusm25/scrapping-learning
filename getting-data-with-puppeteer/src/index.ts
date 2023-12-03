/// <reference lib="DOM" />
import { writeFileSync } from 'fs';
import puppeteer from 'puppeteer';

interface ProductInfo {
  productName: string;
  productPrice: string;
  showName: string;
  productLink: string;
  productImage: string;
  productDescription: string;
  productReviews: string;
  menu: string;
  subMenu: string;
  productPriceAsNumber: number;
}

interface MenuInfo {
  parent?: MenuInfo;
  menuName: string;
  menuLink: string;
}

// get all products from https://webscraper.io/test-sites/e-commerce/allinone
(async () => {
  const URL = 'https://webscraper.io';

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const products: Array<ProductInfo> = [];
  const productPages: Array<MenuInfo> = [];

  await page.goto(`${URL}/test-sites/e-commerce/allinone`);

  const menuPages: Array<MenuInfo> = await page.evaluate(() => {
    const menus: Array<MenuInfo> = [];
    document.querySelectorAll('#side-menu > li > a').forEach(menu => {
      const menuName = menu.textContent?.trim();
      const menuLink = menu.getAttribute('href');
      if (menuLink && menuName && menuName !== 'Home') {
        menus.push({ menuName, menuLink });
      }
    });
    return menus;
  });

  for (const menuPage of menuPages) {
    await page.goto(`${URL}${menuPage.menuLink}`);

    const subPages = await page.evaluate(currentPage => {
      const pages: Array<MenuInfo> = [];

      document.querySelectorAll('.nav-second-level > li > a').forEach(menu => {
        const menuName = menu.textContent?.trim();
        const menuLink = menu.getAttribute('href');
        if (menuLink && menuName) {
          pages.push({ menuName, menuLink, parent: currentPage });
        }
      });
      return pages;
    }, menuPage);

    productPages.push(...subPages);
  }

  for (const productPage of productPages) {
    await page.goto(`${URL}${productPage.menuLink}`);

    const pageProducts: Array<ProductInfo> = await page.evaluate(
      currentPage => {
        const products: Array<ProductInfo> = [];

        document.querySelectorAll('.product-wrapper').forEach(product => {
          products.push({
            menu: currentPage.parent?.menuName || '',
            subMenu: currentPage.menuName,
            productDescription:
              product.querySelector('.description')?.textContent?.trim() || '',
            productImage:
              product.querySelector('.img-responsive')?.getAttribute('src') ||
              '',
            productLink:
              product
                .querySelector('.caption > h4 > a')
                ?.getAttribute('href') || '',
            productName:
              product
                .querySelector('.caption > h4 > a')
                ?.getAttribute('title') || '',
            showName:
              product.querySelector('.caption > h4 > a')?.textContent?.trim() ||
              '',
            productPrice:
              product.querySelector('.price')?.textContent?.trim() || '',
            productPriceAsNumber: Number(
              product
                .querySelector('.price')
                ?.textContent?.trim()
                .replace(/(?![\.])[\D]/g, ''),
            ),
            productReviews:
              product.querySelector('.review-count')?.textContent?.trim() || '',
          });
        });

        return products;
      },
      productPage,
    );

    products.push(...pageProducts);
  }

  writeFileSync('result.json', JSON.stringify(products, null, 2));

  await browser.close();
})();
