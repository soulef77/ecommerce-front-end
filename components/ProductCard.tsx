// components/ProductCard.jsx
"use client";

import Image from 'next/image';
import {Component} from "react";

export class ProductCard extends Component<{ name: any, price: any, image: any }> {
    render() {
        const {name, price, image} = this.props;
        return (
            <div className="flex flex-col items-center">
                <div className="w-64 h-96 border border-gray-300 flex items-center justify-center">
                    <Image
                        src={image}
                        alt={name}
                        width={256}
                        height={384}
                        objectFit="cover"
                    />
                </div>
                <div className="mt-2 text-center">
                    <h3 className="font-normal text-base">{name}</h3>
                    <p className="text-gray-700 text-sm">{price} €</p>
                </div>
            </div>
        );
    }
}
