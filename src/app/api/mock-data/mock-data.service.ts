import { Injectable } from '@angular/core';
import { faker, fakerPL } from '@faker-js/faker';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getKeywords(amount: number) {
    const products = [
      ...new Set(
        Array.from({ length: amount }, () => faker.commerce.product())
      ),
    ];
    const productNames = [
      ...new Set(
        Array.from({ length: amount }, () => faker.commerce.productName())
      ),
    ];
    const productAdjectives = [
      ...new Set(
        Array.from({ length: amount }, () => faker.commerce.productAdjective())
      ),
    ];
    return products.concat(productNames, productAdjectives);
  }

  getCityNames() {
    return [
      ...new Set(Array.from({ length: 5000 }, () => fakerPL.location.city())),
    ].sort();
  }
}
