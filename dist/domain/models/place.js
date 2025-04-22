"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
class Place {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.category = props.category;
        this.latitude = props.latitude;
        this.longitude = props.longitude;
        this.createdAt = props.createdAt;
    }
}
exports.Place = Place;
