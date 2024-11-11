import { Component } from 'vue';

export interface NavigationModel {
    label: string | ((props: { pathname: string; customerId: string | undefined }) => string);
    href?: string;
    icon?: Component;
    position?: NavigationPosition;
    group?: string;
    description?: string;
    children?: NavigationModel[];
    external?: boolean;
}

export enum NavigationPosition
{
    TOP,
    LEFT_TOP,
    BOTTOM,
    LEFT_BOTTOM
}
