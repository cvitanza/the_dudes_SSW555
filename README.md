# the_dudes_SSW555
Github Repo for SSW-555 project. Group 20 -- the dudes
Team Members: Cory Vitanza, Lucas Hope, Steven DeFalco, Xavier Carty, and Gleb Myshkin

### Diet Analyzer

Our group, **Group 20**, has selected option 2 for our project: the **Diet Analyzer**. The key objective of this project is to develop a tool that allows users to capture images of their meals, recognize the ingredients, and analyze the nutritional content. Based on this analysis, the system will provide dietary suggestions to help users improve their eating habits. The tool will also store data for future reference, ensuring ease of use and accuracy in handling responses.


### Features

1. **Image Capture and Recognition**: Users can capture images of their meals, and the system will recognize the ingredients.
  
2. **Nutritional Analysis**: Analyze the nutritional content of meals to provide insights into dietary choices.

3. **Personalized Dietary Suggestions**: Offer recommendations based on individual nutritional needs and preferences, helping users achieve their dietary goals. This includes detailed suggestions on what types of food users can or cannot eat based on their specific diets, such as low-carb diets for diabetics or vegan diets.

4. **Glucose Level Integration**: For users with strict dietary needs, such as diabetes, the analyzer will provide food recommendations based on self-inputted glucose levels.

5. **Alternative Recipes**: Suggest alternative recipes tailored to users' dietary restrictions and preferences. The system will generate or recommend recipes that exclude unwanted ingredients while maintaining a nutritional balance, accommodating users with food allergies, intolerances, or specific lifestyle choices like gluten-free diets.


## Testing

The project uses [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and Jest for unit testing. 

Postman is used for API Testing.

### BottomNav Component Tests

The `BottomNav` component's tests verify that clicking on each icon navigates to the correct page.

### Upload Component Tests

The `Upload` component's tests ensure that button clicks trigger the correct actions and handle file uploads.

### Running Tests

To run the tests, use the following command:

npm test

### Technology Used

Database uses MongoDB

Cloud Service is Cloudinary

### Sprints
Sprint 1: Focus on creating UI/UX for home & menu screens. Make user experience bettwe by cleaning up the navigation system.

Sprint 2 (future): We will work on setting up a recipe database, create backend API, and integrate multiple APIs while testing and deploying website. Look into creating a login function with its own database.

### Styling
```markdown
## Styling

The project utilizes CSS to achieve a modern, responsive design:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}


