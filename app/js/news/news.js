class News {
    constructor(root) {
        this.root = root;
        const loader = root.querySelector('.loader');

        window.newsLoadingStart = () => {
            loader.style.display = 'flex';
        }

        window.newsLoadingEnd = () => {
            loader.style.display = 'none';
        }
    }
}

export default News;