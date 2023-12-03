import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

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

// get all products from https://webscraper.io/test-sites/e-commerce/allinone
(async () => {
  const URL = 'https://webscraper.io';
  const page = await axios.get(`${URL}/test-sites/e-commerce/allinone`);

  const dom = cheerio.load(page.data);

  const products: Array<ProductInfo> = [];
  const menuPages = dom('#side-menu > li > a')
    .map((_, element) => {
      return {
        menu: dom(element).text().trim(),
        link: dom(element).attr('href'),
      };
    })
    .toArray()
    .filter(({ menu }) => menu !== 'Home');

  for (const menuPage of menuPages) {
    const menuPageDom = cheerio.load(
      (await axios.get(`${URL}${menuPage.link}`)).data,
    );

    const subMenuPages = menuPageDom('.nav-second-level > li > a')
      .map((_, element) => {
        return {
          subMenu: menuPageDom(element).text().trim(),
          link: menuPageDom(element).attr('href'),
        };
      })
      .toArray();

    for (const subMenuPage of subMenuPages) {
      const subMenuPageDom = cheerio.load(
        (await axios.get(`${URL}${subMenuPage.link}`)).data,
      );

      subMenuPageDom('.product-wrapper').each((index, element) => {
        const elementDom = subMenuPageDom(element);

        const productName = elementDom.find('.caption > h4 > a').attr('title');
        const productLink = elementDom.find('.caption > h4 > a').attr('href');
        const showName = elementDom.find('.caption > h4 > a').text();
        const productPrice = elementDom.find('.price').text();
        const productImage = elementDom.find('.img-responsive').attr('src');
        const productDescription = elementDom.find('.description').text();
        const productReviews = elementDom.find('.review-count').text();

        products.push({
          productName: productName || 'Product name not found',
          productPrice,
          productPriceAsNumber: Number(
            productPrice.replace(/(?![\.])[\D]/g, ''),
          ),
          showName,
          productLink: productLink || 'Product link not found',
          productImage: productImage || 'Product image not found',
          productDescription,
          productReviews,
          menu: menuPage.menu,
          subMenu: subMenuPage.subMenu,
        });
      });
    }
  }

  writeFileSync('result.json', JSON.stringify(products, null, 2));
})();
