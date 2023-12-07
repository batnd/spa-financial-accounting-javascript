export class ColorGenerator {
    static createRandomColors(numberOfColors) {
        let colors = [];
        for (let i = 0; i < numberOfColors; i++) {
            const color = Math.floor(Math.random() * 16777215).toString(16);
            colors.push('#' + color);
        }
        return colors;
    }
}